import { useState, useContext, useEffect } from "react";
import {
  UserWebSocketContext,
  WeatherWebSocketContext,
} from "../../../middleware/websocket";
import { FetchStateContext } from "../../../middleware/fetch";
import { BACKEND_WEBSERVER_HOST } from "../../../frontendConfig";
import parseUserDataFrontendView from "../../../utils/data/user";
import parseWeatherDataFrontendView from "../../../utils/data/weather";
import { registerMessageListener } from "../../../utils/listeners/webSocketMessage";
import { renderModals } from "./modals";
import { UserDataFormModal, userModalOptions } from "./modals/userAdminModal";
import {
  WeatherAdminDataFormModal,
  weatherModalOptions,
} from "./modals/weatherAdminModal";
import DropDownButton from "../../../utils/gui/dropDown";
import ResourceManagementTable from "../../../utils/gui/resourceManageSystem/table";

// a component that fetchs all the user and weather data at the top level
// then pass the data to the lower level view
// listen to update of user and weather data on respective websockets
const AdminView = (props) => {
  const [dataLists, setDataLists] = useState({
    User: null,
    Weather: null,
  });
  const [table, setTable] = useState("User");
  const { username } = props.user;
  const { webSocket: userWebSocket } = useContext(UserWebSocketContext);
  const { webSocket: weatherWebSocket } = useContext(WeatherWebSocketContext);
  const { fetchFactory } = useContext(FetchStateContext);
  const dataFetch = fetchFactory({
    success: false,
    error: true,
    loading: false,
  });

  const handleTableSelect = (event) => setTable(event);
  const switchViewOptions = {
    handleSelect: handleTableSelect,
    buttonName: table,
    options: Object.keys(dataLists),
  };

  const renderSwitchView = (switchViewOptions) => {
    if (switchViewOptions !== undefined && switchViewOptions !== null) {
      return <DropDownButton {...switchViewOptions} />;
    }
  };

  const renderUserModal = renderModals(UserDataFormModal);
  const renderWeatherModal = renderModals(WeatherAdminDataFormModal);

  const updateUserData = (resultJson) => {
    const newUserList = parseUserDataFrontendView(resultJson);
    setDataLists((dataLists) => {
      return { ...dataLists, User: newUserList };
    });
  };

  const updateWeatherData = (resultJson) => {
    const newWeatherList = parseWeatherDataFrontendView(resultJson);
    setDataLists((dataLists) => {
      return { ...dataLists, Weather: newWeatherList };
    });
  };

  useEffect(() => {
    //initial fetch user data
    (async () => {
      const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/admin/users`;
      const payload = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("accessToken"),
          username,
        },
      };
      const { success, result, fetching } = await dataFetch(url, payload);
      if (success && !fetching) updateUserData(result);
    })();
  }, []);

  useEffect(() => {
    //user data update
    const handler = (event) => {
      const { success, result } = JSON.parse(event.data);
      if (success) updateUserData(result);
    };
    return registerMessageListener(userWebSocket, handler);
  }, [userWebSocket]);

  useEffect(() => {
    //initial fetch weather data
    (async () => {
      const url = `${BACKEND_WEBSERVER_HOST}/api/v1/resources/user/weathers`;
      const payload = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("accessToken"),
          username,
        },
      };
      const { success, result, fetching } = await dataFetch(url, payload);
      if (success && !fetching) updateWeatherData(result);
    })();
  }, []);

  useEffect(() => {
    //weather data update
    const handler = (event) => {
      const { success, result } = JSON.parse(event.data);
      if (success) updateWeatherData(result);
    };
    return registerMessageListener(weatherWebSocket, handler);
  }, [weatherWebSocket]);

  return (
    <>
      {table === "User" ? (
        <ResourceManagementTable
          key="user"
          dataList={dataLists.User}
          switchViewOptions={switchViewOptions}
          renderSwitchView={renderSwitchView}
          modalConfig={userModalOptions}
          renderModals={renderUserModal}
          options={["username", "email", "viewMode"]}
        />
      ) : (
        <ResourceManagementTable
          key="weather"
          dataList={dataLists.Weather}
          switchViewOptions={switchViewOptions}
          renderSwitchView={renderSwitchView}
          modalConfig={weatherModalOptions}
          renderModals={renderWeatherModal}
          options={["name", "latitude", "longitude"]}
          optionsType={{ name: String, latitude: Number, longitude: Number }}
        />
      )}{" "}
    </>
  );
};

export default AdminView;
