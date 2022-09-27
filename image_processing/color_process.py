import sys,random,math
from PIL import Image
import extcolors
# https://pypi.org/project/extcolors/
# from colormap import rgb2hex
# https://pypi.org/project/colormap/

def extract_color(img_loc):
    '''
    return color,and pixel ct
    :param img_loc:
    :return:
    '''
    colors, pixel_count = extcolors.extract_from_path(img_loc)
    rgb_descendent=[]
    for c in colors:
        rgb_descendent.append(c)
    return rgb_descendent


    