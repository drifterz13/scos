.PHONY: docker-order docker-warehouse docker-web docker-run

docker-web:
	docker build -t web -f apps/web/Dockerfile .

docker-order:
	docker build -t order-svc -f apps/order/Dockerfile .

docker-warehouse:
	docker build -t warehouse-svc -f apps/warehouse/Dockerfile .

docker-run:
	docker-compose -f docker-compose.dev.yml up -d
