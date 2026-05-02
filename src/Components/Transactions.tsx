import { useEffect, useState } from 'react';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ExternalLink,
  IndianRupee,
  Loader2,
  Receipt,
  Search,
  User,
  XCircle,
} from 'lucide-react';
import Pagination from './Pagination';
import { fetchTransactionLogs } from '../Apis/Admin-Api';

interface ServiceItem {
  id: string | null;
  name: string;
  price: number;
  duration: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

interface RequestPayload {
  amount: number;
  currency: string;
  bookingId: string;
  paymentType: string;
  services: ServiceItem[];
  customerDetails: CustomerDetails;
}

interface ResponsePayload {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[];
  offer_id: string | null;
  receipt: string;
  status: string;
}

interface TransactionLog {
  _id: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  stage: string;
  status: string;
  requestPayload: RequestPayload;
  responsePayload: ResponsePayload;
  createdAt: string;
  __v: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' },
  SUCCESS: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  FAILED: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-400' },
  REFUNDED: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-400' },
};

const stageConfig: Record<string, { bg: string; text: string }> = {
  ORDER_CREATED: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
  PAYMENT_CAPTURED: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  PAYMENT_FAILED: { bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<TransactionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  const loadTransactions = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTransactionLogs(pageNum, limit);
      if (response.success) {
        setTransactions(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setExpandedRow(null);
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const filteredTransactions = transactions.filter((t) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.razorpayOrderId.toLowerCase().includes(term) ||
      t.requestPayload?.customerDetails?.name?.toLowerCase().includes(term) ||
      t.requestPayload?.customerDetails?.email?.toLowerCase().includes(term) ||
      t.requestPayload?.customerDetails?.phone?.includes(term) ||
      t.status.toLowerCase().includes(term)
    );
  });

  const getStatusStyle = (status: string) =>
    statusConfig[status] || { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700', dot: 'bg-gray-400' };

  const getStageStyle = (stage: string) =>
    stageConfig[stage] || { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700' };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 text-sm">Loading transactions…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="p-4 bg-red-50 rounded-full">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-gray-700 font-medium">{error}</p>
          <button
            onClick={() => loadTransactions(page)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Transaction Logs
            </h2>
            <p className="mt-1 text-gray-600">
              Monitor all payment transactions and their statuses.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
              <CreditCard size={16} className="mr-2" />
              {pagination?.totalCount ?? 0} Total
            </span>
          </div>
        </div>

        {/* Search & Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="sm:col-span-2 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, customer name, email, phone…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-100 font-medium uppercase tracking-wide">Page Total</p>
              <p className="text-xl font-bold mt-0.5">
                {formatCurrency(filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <IndianRupee size={22} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                    <div className="flex items-center gap-1.5">
                      <ArrowUpDown size={14} /> Date
                    </div>
                  </th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Order ID</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Customer</th>
                  <th className="text-right px-5 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Amount</th>
                  <th className="text-center px-5 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Stage</th>
                  <th className="text-center px-5 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Status</th>
                  <th className="text-center px-5 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.map((txn) => {
                  const stStatus = getStatusStyle(txn.status);
                  const stStage = getStageStyle(txn.stage);
                  const isExpanded = expandedRow === txn._id;

                  return (
                    <>
                      <tr
                        key={txn._id}
                        className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/20' : ''}`}
                        onClick={() => toggleRow(txn._id)}
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-900">{formatDate(txn.createdAt)}</div>
                          <div className="text-gray-400 text-xs mt-0.5">{formatTime(txn.createdAt)}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Receipt size={14} className="text-gray-400 shrink-0" />
                            <span className="font-mono text-xs text-gray-700 truncate max-w-[160px]" title={txn.razorpayOrderId}>
                              {txn.razorpayOrderId}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {txn.requestPayload?.customerDetails?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{txn.requestPayload?.customerDetails?.name || '—'}</div>
                              <div className="text-gray-400 text-xs">{txn.requestPayload?.customerDetails?.phone || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="font-bold text-gray-900">{formatCurrency(txn.amount)}</span>
                          <div className="text-gray-400 text-xs mt-0.5">{txn.currency}</div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${stStage.bg} ${stStage.text}`}>
                            {txn.stage.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${stStatus.bg} ${stStatus.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stStatus.dot}`} />
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded details */}
                      {isExpanded && (
                        <tr key={`${txn._id}-detail`}>
                          <td colSpan={7} className="px-5 py-0">
                            <div className="py-5 animate-[fadeIn_0.2s_ease-out]">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {/* Customer & Booking */}
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                  <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <User size={16} className="text-blue-500" /> Customer & Booking
                                  </h4>
                                  <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Name</span>
                                      <span className="font-medium text-gray-900">{txn.requestPayload?.customerDetails?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Email</span>
                                      <span className="font-medium text-gray-900">{txn.requestPayload?.customerDetails?.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Phone</span>
                                      <span className="font-medium text-gray-900">{txn.requestPayload?.customerDetails?.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Booking ID</span>
                                      <span className="font-mono text-xs text-gray-700">{txn.requestPayload?.bookingId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Payment Type</span>
                                      <span className="font-medium text-gray-900 capitalize">{txn.requestPayload?.paymentType}</span>
                                    </div>
                                  </div>
                                  {/* Services */}
                                  {txn.requestPayload?.services?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Services</p>
                                      <div className="space-y-2">
                                        {txn.requestPayload.services.map((svc, i) => (
                                          <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                                            <span className="text-sm text-gray-800 capitalize">{svc.name}</span>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                              <span>{svc.duration} min</span>
                                              <span className="font-semibold text-gray-900">{formatCurrency(svc.price)}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Razorpay Response */}
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                  <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <ExternalLink size={16} className="text-purple-500" /> Razorpay Response
                                  </h4>
                                  <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Order ID</span>
                                      <span className="font-mono text-xs text-gray-700">{txn.responsePayload?.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Amount (paise)</span>
                                      <span className="font-medium text-gray-900">{txn.responsePayload?.amount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Amount Paid</span>
                                      <span className="font-medium text-gray-900">{txn.responsePayload?.amount_paid?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Amount Due</span>
                                      <span className="font-medium text-gray-900">{txn.responsePayload?.amount_due?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Attempts</span>
                                      <span className="font-medium text-gray-900">{txn.responsePayload?.attempts}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Receipt</span>
                                      <span className="font-mono text-xs text-gray-700">{txn.responsePayload?.receipt}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Gateway Status</span>
                                      <span className="font-medium text-gray-900 capitalize">{txn.responsePayload?.status}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredTransactions.map((txn) => {
              const stStatus = getStatusStyle(txn.status);
              const stStage = getStageStyle(txn.stage);
              const isExpanded = expandedRow === txn._id;

              return (
                <div key={txn._id} className="p-4">
                  <div className="flex items-start justify-between mb-3" onClick={() => toggleRow(txn._id)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {txn.requestPayload?.customerDetails?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{txn.requestPayload?.customerDetails?.name || '—'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(txn.createdAt)} • {formatTime(txn.createdAt)}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">{formatCurrency(txn.amount)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${stStatus.bg} ${stStatus.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${stStatus.dot}`} />
                      {txn.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${stStage.bg} ${stStage.text}`}>
                      {txn.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-gray-500 truncate max-w-[200px]">{txn.razorpayOrderId}</p>
                    <button onClick={() => toggleRow(txn._id)} className="p-1 rounded hover:bg-gray-100">
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 animate-[fadeIn_0.2s_ease-out]">
                      <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2 border border-gray-100">
                        <p className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Customer</p>
                        <p className="text-gray-600">{txn.requestPayload?.customerDetails?.email}</p>
                        <p className="text-gray-600">{txn.requestPayload?.customerDetails?.phone}</p>
                        <p className="text-gray-600">Booking: <span className="font-mono text-xs">{txn.requestPayload?.bookingId}</span></p>
                      </div>
                      {txn.requestPayload?.services?.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
                          <p className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-2">Services</p>
                          {txn.requestPayload.services.map((svc, i) => (
                            <div key={i} className="flex justify-between py-1">
                              <span className="capitalize text-gray-800">{svc.name}</span>
                              <span className="text-gray-600">{formatCurrency(svc.price)} • {svc.duration}min</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2 border border-gray-100">
                        <p className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Gateway</p>
                        <div className="flex justify-between"><span className="text-gray-500">Paid</span><span>{txn.responsePayload?.amount_paid}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Due</span><span>{txn.responsePayload?.amount_due}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="capitalize">{txn.responsePayload?.status}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredTransactions.length === 0 && !loading && (
            <div className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Receipt size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No transactions found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search term.' : 'Transactions will appear here once payments are made.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && (
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default Transactions;
