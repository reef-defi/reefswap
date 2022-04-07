up:
	docker-compose -p trading-bot -f —context reef docker-compose.yml up -d

down:
	docker-compose -p trading-bot -f —context reef docker-compose.yml down

build:
	docker-compose -p trading-bot -f —context reef docker-compose.yml build