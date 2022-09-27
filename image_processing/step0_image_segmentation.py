import os
import sys,random,math,itertools
from PIL import Image
import utils
import color_process as CP






# def image_segmentation(source_dir,output_dir):



source_dir="../raw_data/raw_20220912/"
output_dir="../processed/segmented/"
test_file="IMG_20220912_0005.jpg"
# utils.read_image(source_dir+test_file)

CP.extract_color(source_dir+test_file)

