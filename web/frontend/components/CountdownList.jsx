import {
    LegacyCard,
    ResourceList,
    Pagination,
    SkeletonBodyText,
    SkeletonDisplayText,
} from "@shopify/polaris";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountdowns } from "../store/countdownSlice";

import CountdownFilters from "./CountdownFilters";
import CountdownItem from "./CountdownItem";
import { useDebounce } from "../hooks/useDebounce";

export default function CountdownList({ onEdit }) {
    const dispatch = useDispatch();

    const { timers, pagination, loading } = useSelector(
        (state) => state.countdowns
    );

    const [filters, setFilters] = useState({ query: "", status: undefined });
    const [page, setPage] = useState(1);

    const debouncedQuery = useDebounce(filters.query, 500);

    useEffect(() => {
        dispatch(
            fetchCountdowns({
                page,
                filters: { ...filters, query: debouncedQuery },
            })
        );
    }, [dispatch, page, debouncedQuery, filters.status]);

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

                    return (
                        <CountdownItem
                            key={item._id}
                            item={item}
                            onEdit={onEdit}
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
