from PIL import Image
import os,pickle,json

def mkdir(dir):
    if not os.path.exists(dir):
        os.mkdir(dir)

def read_image(imgAddress):
    im_o = Image.open(imgAddress)
    return im_o

def save_object(obj, filename):
    with open(filename, 'wb') as output:
        pickle.dump(obj, output, pickle.HIGHEST_PROTOCOL)


def load_object(fileName):

    with open(fileName, 'rb') as inputF:
        obj = pickle.load(inputF)
        inputF.close()
    return obj
