.PHONY: build clean

build:
	cd app && meteor build ../build --server-only --architecture os.linux.x86_64

clean:
	rm -r build

docker-image:
	docker build -t shrikantpatnaik/s3gallery .
