// concursos-web/src/hooks/useFetch.ts

import { useState, useEffect } from "react";

interface UseFetchResult<T> {
    data: T | null;
    carregando: boolean;
    erro: string;
}

export function useFetch<T>(
    fn: () => Promise<T>,
    deps: unknown[] = []
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let cancelado = false;
        setCarregando(true);
        setErro("");

        fn()
            .then((res) => { if (!cancelado) setData(res); })
            .catch(() => { if (!cancelado) setErro("Erro ao carregar dados."); })
            .finally(() => { if (!cancelado) setCarregando(false); });

        return () => { cancelado = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { data, carregando, erro };
}