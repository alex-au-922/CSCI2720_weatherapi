# //CSCI2720 Group Project 26
# //Au Cheuk Ming 1155125363
# //Chin Wen Jun Cyril 1155104882
# //Lee Yat 1155126257
# //Ho Tsz Hin 1155126757
# //Lee Sheung Chit 1155125027
build:
	cd frontend/ && npm run build
	docker-compose build
npm-install:
	cd backend/ && npm i
	cd frontend/ && npm i
local-run-frontend-test:
	cd frontend/ && npm start

up:
	docker-compose up -d
local-run-backend-test: up
	docker logs -f node-backend
down:
	docker-compose down
connect:
	autossh -M 10086 -N -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" -R 10083:127.0.0.1:10083 -R 10084:127.0.0.1:3000 -N -i ./lightsail_bitnami.pem bitnami@52.76.77.52
frontend-build:
	cd frontend && serve -s build
deploy: down build up frontend-build

