import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders, getOrderById } from "@/api/orders";
import toast from "@/hooks/useToast";

export function useTracking() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState(null);

  const isObjectId = (val) => /^[0-9a-fA-F]{24}$/.test(val);

  const fetchOrder = useCallback(async (term) => {
    if (!term) return null;
    if (isObjectId(term)) {
      try {
        return await getOrderById(term);
      } catch (err) {
        if (err?.response?.status !== 404) throw err;
      }
    }
    return await getOrders(1, 10, null, null, null, term);
  }, []);

  const { data: rawOrderResult, isFetching, isError } = useQuery({
    queryKey: ["tracking", searchTerm],
    queryFn: () => fetchOrder(searchTerm),
    enabled: !!searchTerm,
    staleTime: 0,
    retry: 1,
    onError: (err) => toast.error("Unable to fetch order", err?.message),
  });

  const order = useMemo(() => {
    const result = rawOrderResult?.data || rawOrderResult;
    if (!result) return null;

    const matchesSearch = (item) => {
      const normalize = (v) => (v || "").toString().toLowerCase().replace(/[^a-z0-9]/g, "");
      const term = normalize(searchTerm || "");
      const orderNum = normalize(item.orderNumber || item.order_number || "");
      const id = normalize(item._id || item.id || "");
      const phone = normalize(item.phone || "");
      return orderNum === term || id === term || phone === term || orderNum.includes(term) || phone.includes(term);
    };

    if (result.order) return result.order;
    if (Array.isArray(result.orders)) return result.orders.find(matchesSearch) || result.orders[0];
    if (Array.isArray(result)) return result.find(matchesSearch) || result[0];
    if (result._id || result.id || result.order_number) return result;
    return null;
  }, [rawOrderResult, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) setSearchTerm(trimmed);
  };

  return {
    query,
    setQuery,
    searchTerm,
    order,
    isFetching,
    isError,
    notFound: !!searchTerm && !isFetching && !order && !isError,
    handleSearch,
  };
}