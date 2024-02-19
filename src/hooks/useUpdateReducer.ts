import type React from "react";
import {useCallback, useState} from "react";

export function useUpdateReducer<T>(initialState: T | (()=>T)) {

	const [state, setState] = useState<T>(initialState);

	const updateState = useCallback((updated?: any) => {
		setState((prevState) => ({...prevState, ...updated}))
	}, [setState])

	return ([state, setState, updateState]) as UpdateReducerTuple<T>

}

type UpdateReducerTuple<T> = [T, React.Dispatch<React.SetStateAction<T>>, (updated: T) => void]

