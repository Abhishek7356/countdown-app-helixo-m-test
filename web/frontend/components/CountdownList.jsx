import {
    LegacyCard,
    ResourceList,
    Pagination,
    SkeletonBodyText,
    SkeletonDisplayText,
} from "@shopify/polaris";
import { useEffect, useState, useCallback } from "react";
import CountdownFilters from "./CountdownFilters";
import CountdownItem from "./CountdownItem";

export default function CountdownList({ onEdit }) {
    const [timers, setTimers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ query: "", status: undefined });
    const [page, setPage] = useState(1);

    const fetchTimers = useCallback(async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                page,
                limit: 5,
                query: filters.query || "",
            });

            if (filters.status?.length) {
                params.append("status", filters.status[0]);
            }

            const res = await fetch(`/api/countdown/list?${params}`);
            const data = await res.json();

            if (data.success) {
                setTimers(data.items || []);
                setPagination(data.pagination || {});
            }
        } catch (err) {
            console.error("Fetch timers error:", err);
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchTimers();
    }, [fetchTimers]);

    // ✅ Create safe skeleton items
    const skeletonItems = Array.from({ length: 2 }).map((_, index) => ({
        id: `skeleton-${index}`,
        __skeleton: true,
    }));

    const itemsToRender = loading ? skeletonItems : timers;

    return (
        <LegacyCard>
            <ResourceList
                resourceName={{ singular: "timer", plural: "timers" }}
                items={itemsToRender}
                filterControl={
                    <CountdownFilters
                        filters={filters}
                        setFilters={setFilters}
                    />
                }
                renderItem={(item) => {
                    // ✅ Skeleton rendering
                    if (item.__skeleton) {
                        return (
                            <ResourceList.Item id={item.id}>
                                <div style={{ width: "100%" }}>
                                    <SkeletonDisplayText size="small" />
                                    <div style={{ marginTop: 8 }}>
                                        <SkeletonBodyText lines={2} />
                                    </div>
                                </div>
                            </ResourceList.Item>
                        );
                    }

                    // ✅ Real item rendering
                    return (
                        <CountdownItem
                            key={item._id}
                            item={item}
                            onEdit={onEdit}
                            refresh={fetchTimers}
                        />
                    );
                }}
            />

            <div style={{ padding: 16 }}>
                <Pagination
                    hasPrevious={pagination?.hasPrevPage}
                    onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
                    hasNext={pagination?.hasNextPage}
                    onNext={() => setPage((prev) => prev + 1)}
                />
            </div>
        </LegacyCard>
    );
}
