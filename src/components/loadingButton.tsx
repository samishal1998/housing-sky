import React, {useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import type {CircularProgressProps} from './circularProgress';
import {CircularProgress} from './circularProgress';

export type LoadingButtonProps = {
    loading?: boolean;
    loadingLabel?: ReactNode;
    circularProgressProps?: CircularProgressProps;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export const LoadingButton = ({
                                  loading,
                                  loadingLabel = 'Loading',
                                  circularProgressProps,
                                  children,
                                  ...props
                              }: LoadingButtonProps) => {
    const parent = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>();
    useEffect(() => {
        setHeight(parent.current?.clientHeight);
    }, []);

    return (
        <button {...props} disabled={loading ?? props.disabled}>
            {loading ? (
                <div ref={parent} className={'flex flex-row justify-center flex-nowrap items-center gap-3'}>
                    <CircularProgress
                        width={height ? 0.6 * height : '1em'}
                        height={height ? 0.6 * height : '1em'}
                        {...(circularProgressProps ?? {})}
                        color={'white'}
                    />

                    {loadingLabel}
                </div>
            ) : (
                children
            )}
        </button>
    );
};
