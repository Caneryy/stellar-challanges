import { useCallback, useEffect, useState } from "react";
import { getXlmBalance } from "../lib/balance";

export function useBalance(address: string | null) {
  const [balance, setBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async (options?: { silent?: boolean }) => {
    if (!address) {
      setBalance("0");
      setError(null);
      return;
    }

    if (!options?.silent) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const nextBalance = await getXlmBalance(address);
      setBalance(nextBalance);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load balance.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    let active = true;

    const loadBalance = async () => {
      if (!address) {
        if (active) {
          setBalance("0");
          setError(null);
        }
        return;
      }

      if (active) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const nextBalance = await getXlmBalance(address);
        if (active) {
          setBalance(nextBalance);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load balance.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadBalance();

    return () => {
      active = false;
    };
  }, [address]);

  return {
    balance,
    isLoading,
    error,
    refreshBalance,
  };
}
