import json
from locust import HttpUser, task, between

servers = dict()
class MessageTraffic(HttpUser):
    @task
    def GetMessage(self):
        response = self.client.get("/")
        rstr = response.text
        arr = rstr.split("\n")
        host = str(arr[2])
        server = host.replace("Hostname: ", "")
        if server in servers.keys():
            servers[server] += 1
        else:
            servers[server] = 1

    def on_stop(self):
        print(servers)