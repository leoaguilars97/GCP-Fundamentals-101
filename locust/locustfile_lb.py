from locust import HttpUser, task, between

apps = dict()
class MessageTraffic(HttpUser):
    @task
    def GetMessage(self):
        response = self.client.get("/")
        sapp = response.text
        app = sapp[31:36]

        if app in apps.keys(): 
            apps[app] += 1
        else:
            apps[app] = 1

    def on_stop(self):
        total = 0
        print("*****")
        for app in apps.keys():
            print(app + " -> " + str(apps[app]))
            total += apps[app]
        print("TOTAL -> " + str(total))