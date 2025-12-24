import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useRedux';
import { fetchOrders, setPage } from '@/domains/orders/ordersSlice';
import { setOrderStatus, setCustomerState } from '@/domains/filters/filtersSlice';
import { PageContainer } from '@/app/layout';
import { DataTable, SelectFilter, StatusBadge, ErrorBanner } from '@/shared/components';
import { Order } from '@/shared/types';
import { ChevronDown, ChevronUp, Package, Calendar, MapPin } from 'lucide-react';

const orderStatusOptions = [
  { value: 'delivered', label: 'Delivered' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'processing', label: 'Processing' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'invoiced', label: 'Invoiced' },
];

const stateOptions = [
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'PR', label: 'Paraná' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'BA', label: 'Bahia' },
  { value: 'GO', label: 'Goiás' },
];

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { dateFrom, dateTo, orderStatus, customerState } = useAppSelector((state) => state.filters);
  const { data, totalCount, page, pageSize, status, error } = useAppSelector((state) => state.orders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const loadData = () => {
    dispatch(fetchOrders({ page, pageSize }));
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, orderStatus, customerState, page]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleRowClick = (order: Order) => {
    setExpandedOrder(expandedOrder === order.order_id ? null : order.order_id);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const columns = [
    {
      key: 'order_id',
      header: 'Order ID',
      render: (order: Order) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{order.order_id}</span>
          {expandedOrder === order.order_id ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      key: 'order_status',
      header: 'Status',
      render: (order: Order) => <StatusBadge status={order.order_status} />,
    },
    {
      key: 'purchase_date',
      header: 'Purchase Date',
      render: (order: Order) => formatDate(order.purchase_date),
    },
    {
      key: 'delivered_date',
      header: 'Delivered',
      render: (order: Order) => formatDate(order.delivered_date),
    },
    {
      key: 'estimated_date',
      header: 'Estimated',
      render: (order: Order) => formatDate(order.estimated_date),
    },
    {
      key: 'items_count',
      header: 'Items',
      className: 'text-right',
      render: (order: Order) => order.items_count,
    },
    {
      key: 'gmv',
      header: 'GMV',
      className: 'text-right',
      render: (order: Order) => (
        <span className="font-medium">{formatCurrency(order.gmv)}</span>
      ),
    },
    {
      key: 'customer_state',
      header: 'State',
      render: (order: Order) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">
          {order.customer_state}
        </span>
      ),
    },
  ];

  const renderExpandedRow = (order: Order) => {
    const isLate = order.delivered_date && order.estimated_date && 
      new Date(order.delivered_date) > new Date(order.estimated_date);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Order Details</p>
            <p className="text-sm text-muted-foreground">
              {order.items_count} items • {formatCurrency(order.gmv)} total
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-info/10 text-info">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Delivery Timeline</p>
            <p className="text-sm text-muted-foreground">
              Estimated: {formatDate(order.estimated_date)}
              {order.delivered_date && (
                <span className={isLate ? 'text-destructive' : 'text-success'}>
                  {' '}• Delivered: {formatDate(order.delivered_date)}
                  {isLate && ' (Late)'}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Customer Location</p>
            <p className="text-sm text-muted-foreground">
              {order.customer_city}, {order.customer_state}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContainer
      title="Orders"
      subtitle="Manage and track all orders"
      onRefresh={loadData}
      isLoading={status === 'loading'}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 glass-card rounded-xl">
        <SelectFilter
          label="Order Status"
          value={orderStatus}
          options={orderStatusOptions}
          onChange={(val) => dispatch(setOrderStatus(val))}
        />
        <SelectFilter
          label="Customer State"
          value={customerState}
          options={stateOptions}
          onChange={(val) => dispatch(setCustomerState(val))}
        />
      </div>

      {/* Error */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={loadData}
          className="mb-6"
        />
      )}

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        isLoading={status === 'loading'}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
        expandedRow={expandedOrder}
        renderExpanded={renderExpandedRow}
        getRowId={(order) => order.order_id}
      />
    </PageContainer>
  );
};

export default OrdersPage;
