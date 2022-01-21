import {DependencyList, useCallback, useEffect, useState} from "react";

export type AsyncMemoValue<T> = { loading: boolean, value?: T };

export function useAsyncMemo<T>(factory: () => Promise<T> | undefined | null, deps: DependencyList, initial: T | undefined = undefined): [AsyncMemoValue<T>, () => void] {
    const [val, setVal] = useState<AsyncMemoValue<T>>({loading: true, value: initial})
    const [reloadFlag, setReloadFlag] = useState(false)
    const reloadItems = useCallback(() => setReloadFlag(true), [setReloadFlag])
    useEffect(() => {
        if (reloadFlag) {
            setReloadFlag(false)
            setVal({loading: true, value: val.value})
            return
        }
        let cancel = false
        const promise = factory()
        if (promise === undefined || promise === null) return
        promise.then((val) => {
            if (!cancel) {
                setVal({loading: false, value: val})
            }
        })
        return () => {
            cancel = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, reloadFlag, setReloadFlag])
    return [val, reloadItems]
}
