.PHONY: docker-order docker-warehouse docker-web docker-run dev-all \
        ssm-warehousedb ssm-orderdb

docker-web:
	docker build -t web -f apps/web/Dockerfile .

docker-order:
	docker build -t order-svc -f apps/order-api/Dockerfile .

docker-warehouse:
	docker build -t warehouse-svc -f apps/warehouse-api/Dockerfile .

docker-run:
	docker-compose -f docker-compose.dev.yml up -d

ssm-warehousedb:
	aws ssm start-session \
		--target i-03508a7913ccb1b99 \
		--document-name AWS-StartPortForwardingSessionToRemoteHost \
		--parameters '{"host":["scos-warehouse-dbfbf19f3.cjemee80aitz.ap-southeast-1.rds.amazonaws.com"], "portNumber":["5432"], "localPortNumber":["5445"]}'

ssm-orderdb:
	aws ssm start-session \
		--target i-03508a7913ccb1b99 \
		--document-name AWS-StartPortForwardingSessionToRemoteHost \
		--parameters '{"host":["scos-order-dbbdf3b32.cjemee80aitz.ap-southeast-1.rds.amazonaws.com"], "portNumber":["5432"], "localPortNumber":["5444"]}'

