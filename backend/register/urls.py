from django.urls import path
from register.views import registerPage, changePassword, activateAcc, confirmChange, recoverPassword, recovery, isLinkExpired
app_name = 'register'
urlpatterns = [
    path('', registerPage, name = 'registerPage'),
    path('changePassword/', changePassword, name = 'changePassword'),
    path('activate/', activateAcc, name = 'activateAcc'),
    path('confirmChange/', confirmChange, name = 'confirmChange'),
    path('recoverPassword/', recoverPassword, name = "recoverPassword"),
    path('recoverPassword/recovery/', recovery , name = "recovery"),
    path('recoverPassword/recovery/<str:link>/', isLinkExpired , name = "recoverylink")
]
