from locust import HttpUser, task, between

apps = dict()
class MessageTraffic(HttpUser):
    @task
    def GetMessage(self):
        response = self.client.get("/")
        sapp = response.text
        print(sapp)