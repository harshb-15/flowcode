import datetime
timestamp = datetime.datetime.now()
# for i in timestamp.hour:
#     print(i)
if (timestamp.hour < 12):
    print('Good morning')
elif(timestamp.hour>=12 and timestamp.hour<18):
    print(f'{timestamp.hour}:{timestamp.minute}:{timestamp.second}')
    print('Good afternoon')
else:
    print('Good evening')