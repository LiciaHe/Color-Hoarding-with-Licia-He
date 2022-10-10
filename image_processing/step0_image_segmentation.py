import os
import sys,random,math,itertools
from PIL import Image
import utils
import color_process as CP






def step1_image_segmentation(source_dir,output_dir,img_name):
    im,imd=utils.read_draw_image(source_dir+img_name+file_ext)
    # rect_w=2382
    rect_h=3406
    mini_h=rect_h/3
    margin=20

    w=774
    cols=[
        [130,0,130+w,rect_h],
        [946,0,946+w,rect_h],
        [1766,0,1766+w,rect_h],
    ]
    for ci,col in enumerate(cols):
        col_i=im.crop(col)
        for row_i in range(3):
            y=mini_h*row_i+margin
            x=margin
            rect_im=col_i.crop(
                [
                    x,
                    y,
                    x+w-2*margin,
                    y+mini_h-2*margin
                ]
            )
            rect_im.save(f'{output_dir}{img_name}_{ci}_{row_i}{file_ext}')




    # c_img=im.crop(
    #     [rect_left,rect_top,rect_left+rect_w,rect_top+rect_h]
    # )
    # c_img.show()
    # c_img.save(output_dir+img_name)

def step2_secondary_clean_cut(data_dir,clean_seg_dir,seg_output_dir):
    '''
    perform secondary cut, remove borders, font, and add rename
    :param data_dir:
    :param clean_seg_dir:
    :param seg_output_dir:
    :return:
    '''
    m_w=87
    m_t=60
    m_b=200
    with open (data_dir,"r") as dataF:
        rows=dataF.read().split("\n")
    for i,row in enumerate(rows):
        if i==0:
            continue
        content=row.split(",")
        if len(content)<4 or "empty" in row:
            continue
        img_name=f'{seg_output_dir}{content[0]}{file_ext}'
        name=utils.camel_case(content[1])
        brand=utils.camel_case(content[2])
        type=utils.camel_case(content[3])

        save_name=f'{clean_seg_dir}{brand}_{name}_{type}{file_ext}'
        im=utils.read_image(img_name)
        isize=im.size
        result=im.crop(
            (
                m_w,m_t,isize[0]-m_w,isize[1]-m_b
            )
        )
        result.save(save_name)


source_dir="../raw_data/raw_20220912/"
data_name="../raw_data\color_hoarder_data.csv"

output_dir="../processed/"
test_file="IMG_20220912_0005"
file_ext=".jpg"

# #first cut
seg_output_dir="../processed/segmented/"
# for filename in os.listdir(source_dir):
#     filename=filename[:filename.rfind(".")]
#     step1_image_segmentation(source_dir,seg_output_dir,filename)


#step 2 : secondary cut (remove boundary and name)
clean_seg_dir=f'{output_dir}clean_seg/'
utils.mkdir(clean_seg_dir)
step2_secondary_clean_cut(data_name,clean_seg_dir,seg_output_dir)
