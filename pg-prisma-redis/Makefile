.POSIX:

.build-image:
	@docker build -t next-auth-examples-pg-prisma-redis:latest -f Dockerfile .

.run-image:
	@docker run --rm --name next-auth-examples-pg-prisma-redis -p 3000:3000 --env-file .env next-auth-examples-pg-prisma-redis:latest

.run-all:
	@docker compose up --build

.stop-all:
	@docker compose down
