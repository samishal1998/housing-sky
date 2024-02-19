import React, {useEffect} from "react";
import {useUpdateReducer} from "~/hooks/useUpdateReducer";


export type FileImageProps = { source:File|string|Blob } & React.ImgHTMLAttributes<HTMLImageElement>;

export function FileImage(props: FileImageProps) {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [imgProps, setImgProps, updateImgProps] = useUpdateReducer<any>({...props});

    useEffect(() => {
        const {source} = props;
        if (source) {
            if (source instanceof File) {
                const reader = new FileReader();

                reader.readAsDataURL(source);
                reader.onload = ((e) => {
                    updateImgProps({src: e.target?.result});
                })
            } else if (typeof source === 'string') {
                    updateImgProps({src: source});
            } else if (source instanceof Blob) {
                updateImgProps({src: URL.createObjectURL(source)});
            }
        }

    }, [props, updateImgProps])
	return (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={"image"} onError={() => updateImgProps({src: '/assets/logo-unavailable.svg'})} {...imgProps}/>
    );
}
export const fileImageKey = (source:any)=>{
	if (source) {
		if(source instanceof File){
            return source.name;
        }else if (typeof source === 'string'){
			return source;
		}else return 'unknown'

	}else return 'undefined'

}
