import { Filters, ChoiceList } from "@shopify/polaris";

export default function CountdownFilters({ filters, setFilters }) {
    const filterOptions = [
        {
            key: "status",
            label: "Status",
            filter: (
                <ChoiceList
                    title="Status"
                    titleHidden
                    choices={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ]}
                    selected={filters.status || []}
                    onChange={(value) =>
                        setFilters((prev) => ({ ...prev, status: value }))
                    }
                />
            ),
            shortcut: true,
        },
    ];

    return (
        <Filters
            queryValue={filters.query}
            filters={filterOptions}
            appliedFilters={
                filters.status?.length
                    ? [
                        {
                            key: "status",
                            label: `Status: ${filters.status[0]}`,
                            onRemove: () =>
                                setFilters((prev) => ({ ...prev, status: undefined })),
                        },
                    ]
                    : []
            }
            onQueryChange={(value) =>
                setFilters((prev) => ({ ...prev, query: value }))
            }
            onQueryClear={() =>
                setFilters((prev) => ({ ...prev, query: "" }))
            }
            onClearAll={() => setFilters({ query: "", status: undefined })}
        />
    );
}
