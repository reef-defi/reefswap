up:
	docker-compose -p trading-bot -f docker-compose.yml up -d

down:
	docker-compose -p trading-bot -f docker-compose.yml down

build:
	docker-compose -p trading-bot -f docker-compose.yml build