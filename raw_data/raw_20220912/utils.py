def mkdir(dir):
    if not os.path.exists(dir):
        os.mkdir(dir)

def read_image(imgAddress,m="HSV"):
    im_o = Image.open(imgAddress,mode=m)
    return im_o
