from PIL import Image,ImageDraw
import os,pickle,json
from re import sub

def mkdir(dir):
    if not os.path.exists(dir):
        os.mkdir(dir)

def read_image(imgAddress):
    im_o = Image.open(imgAddress)
    return im_o
def read_draw_image(imgAddress):
    im=read_image(imgAddress)
    img_draw = ImageDraw.Draw(im, "RGB")
    return im,img_draw

def save_object(obj, filename):
    with open(filename, 'wb') as output:
        pickle.dump(obj, output, pickle.HIGHEST_PROTOCOL)


def load_object(fileName):

    with open(fileName, 'rb') as inputF:
        obj = pickle.load(inputF)
        inputF.close()
    return obj

def camel_case(s):
  s = sub(r"(_|-)+", " ", s).title()
  # return ''.join([s[0].lower(), s[1:]])
  return s