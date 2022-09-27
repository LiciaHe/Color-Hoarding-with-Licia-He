import os
import sys,random,math,itertools
from PIL import Image
import utils
import color_process as CP




def batch_extractor(loc,export_loc):
    rgbs=[None for i in range(500)]
    for filename in os.listdir(loc):
        if filename.endswith(".png"):
            print(filename)
            f = os.path.join(loc, filename)
            rgb_des=CP.extract_color(f)
            tag=int(filename[:filename.rfind("_")])
            rgbs[tag]=rgb_des
    utils.save_object(rgbs,export_loc+"rm_rgb_px_ct_des.pkl")
    print(rgbs)




test_loc="D:/licia/art/artwork_organized/digital/running moon/TOKENS/auto/3000/"
export_loc="D:/licia/art/artwork_organized/digital/running moon/TOKENS/analysis/"

batch_extractor(test_loc,export_loc)