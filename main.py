from website import create_app
import socket

app = create_app()

if __name__ == '__main__':
    with open("config.txt", "r") as f:
        data = f.readlines()
    f.close()

    config = {}
    for item in data:
        temp = item.split('=')
        config[temp[0]] = temp[1].strip()

    if config['host'] == "auto":
        config['host'] = socket.gethostbyname(socket.gethostname())
    
    app.run(host=config['host'], port=config['api_port'], debug=True)