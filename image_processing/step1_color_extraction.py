'''
Used to extract color from processed image
'''
import json
import os
import sys,random,math,itertools
from PIL import Image
import utils
import color_process as CP
import extcolors
import colorsys

def extract_color_from_one_image(img_loc,minimum_percentage=0.01,filter_rgb=235,top_rank=10):
    '''
    Only keep color that occupies the minimum percentage of pixels
    :param img_loc:
    :param total_px:
    :param threashold_ct:
    :return:
    '''
    rgb_pixels, pixel_count = extcolors.extract_from_path(img_loc)
    rgbs=[]
    for rgb,px in rgb_pixels:
        if px<pixel_count*minimum_percentage:
            continue
        if all([v>filter_rgb for v in rgb]):
            continue
        rgbs.append(rgb)
    if len(rgbs)>top_rank:
        rgbs=rgbs[:top_rank]
    return rgbs

def step0_extract_and_filter_color():
    '''
    loop through
    :return:
    '''
    colors_storage=[]
    with open (data_name,"r") as dataF:
        rows=dataF.read().split("\n")
    max_rgb_ct=0
    cts={
        "brand":{},
        "type":{},
        "hue_10":{},
    }
    collections={
        "brand":set(),
        "type":set(),
    }
    for i,row in enumerate(rows):
        if i==0:
            continue
        content=row.split(",")
        if len(content)<4 or "empty" in row:
            continue

        name=utils.camel_case(content[1]).strip()
        brand=utils.camel_case(content[2]).strip()
        type=utils.camel_case(content[3]).strip()

        save_name=f'{source_dir}{brand}_{name}_{type}{file_ext}'
        top_rgbs=extract_color_from_one_image(save_name)
        if len(top_rgbs)<1:
            continue
        hsls=[colorsys.rgb_to_hsv(*[v/255 for v in rgb]) for rgb in top_rgbs]
        hue_10_group=int(hsls[0][0]/0.1)

        info={
            "name":name,
            "brand":brand,
            "type":type,
            "note":content[4],
            "rgbs":top_rgbs,
            "rgb_to_hsv":hsls,
            "hue_10":hue_10_group
        }
        collections["brand"].add(brand)
        collections["type"].add(type)
        max_rgb_ct=max(len(top_rgbs),max_rgb_ct)
        colors_storage.append(info)
        info["id"]=len(colors_storage)-1
        for key,value in [("brand",brand),("type",type),("hue_10",hue_10_group)]:
            if value in cts[key]:
                cts[key][value]+=1
            else:
                cts[key][value]=1
    collection_lst={
        "brand": list(collections["brand"]),
        "type": list(collections["type"]),
    }

    full_collection={
        "total_color":len(colors_storage),
        "max_rgb_ct":max_rgb_ct,
        "data":colors_storage,
        "count":cts,
        "collection":collection_lst
    }
    for v in full_collection["collection"]:
        v.sort()

    with open(color_output_name+".json","w") as cpj:
        json.dump(full_collection,cpj)
    with open(web_output_name,"w") as cpj:
        json.dump(full_collection,cpj)


source_dir="../processed/clean_seg/"
output_dir="../processed/analysis/"
data_name="../raw_data\color_hoarder_data.csv"

utils.mkdir(output_dir)
color_output_name=output_dir+"full_data"
web_output_name=f'../web/full_data.json'

file_ext=".jpg"

# print(total_pixel)# 468160
# v=extract_color_from_one_image(f'{source_dir}Diamine_Majestic Blue_Ink.jpg')
# print(v)

step0_extract_and_filter_color()