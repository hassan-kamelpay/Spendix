// ─────────────────────────────────────────────────────────────────────────────
//  App-wide constants
// ─────────────────────────────────────────────────────────────────────────────

export const CATS = [
  { id: 'food',          label: 'Food & Dining',    icon: '🍽️', color: '#f97316', bg: 'rgba(249,115,22,0.14)'  },
  { id: 'transport',     label: 'Transport',         icon: '🚗', color: '#3b82f6', bg: 'rgba(59,130,246,0.14)'  },
  { id: 'bills',         label: 'Bills & Utilities', icon: '⚡', color: '#8b5cf6', bg: 'rgba(139,92,246,0.14)'  },
  { id: 'shopping',      label: 'Shopping',          icon: '🛍️', color: '#ec4899', bg: 'rgba(236,72,153,0.14)'  },
  { id: 'entertainment', label: 'Entertainment',     icon: '🎬', color: '#06b6d4', bg: 'rgba(6,182,212,0.14)'   },
  { id: 'health',        label: 'Health & Fitness',  icon: '💪', color: '#22c55e', bg: 'rgba(34,197,94,0.14)'   },
  { id: 'travel',        label: 'Travel',            icon: '✈️', color: '#eab308', bg: 'rgba(234,179,8,0.14)'   },
  { id: 'education',     label: 'Education',         icon: '📚', color: '#64748b', bg: 'rgba(100,116,139,0.14)' },
  { id: 'other',         label: 'Other',             icon: '📦', color: '#94a3b8', bg: 'rgba(148,163,184,0.14)' },
]

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'UPI / Mobile Pay',
  'Crypto',
  'Other',
]

export const CURRENCIES = [
  { code: 'USD', sym: '$',   name: 'US Dollar'       },
  { code: 'EUR', sym: '€',   name: 'Euro'            },
  { code: 'GBP', sym: '£',   name: 'British Pound'   },
  { code: 'PKR', sym: '₨',   name: 'Pakistani Rupee' },
  { code: 'INR', sym: '₹',   name: 'Indian Rupee'    },
  { code: 'AED', sym: 'د.إ', name: 'UAE Dirham'      },
  { code: 'SAR', sym: '﷼',   name: 'Saudi Riyal'     },
]

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'expenses',  label: 'Expenses'  },
  { id: 'analytics', label: 'Analytics' },
  { id: 'budget',    label: 'Budget'    },
  { id: 'settings',  label: 'Settings'  },
]

// ── Seed data (loaded when localStorage is empty) ─────────────────────────────
const _uid = () => Math.random().toString(36).slice(2, 10)
const _ago = (days, mo = 0) => {
  const d = new Date()
  d.setMonth(d.getMonth() - mo)
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export const SEED_DATA = [
  // This month
  { id: _uid(), amount:  45.50, description: 'Whole Foods Market',      category: 'food',          date: _ago(0),    paymentMethod: 'Debit Card',    notes: 'Weekly groceries'    },
  { id: _uid(), amount:   8.90, description: 'Uber Ride to Work',        category: 'transport',     date: _ago(0),    paymentMethod: 'Credit Card',   notes: ''                    },
  { id: _uid(), amount:  15.99, description: 'Netflix Subscription',     category: 'entertainment', date: _ago(1),    paymentMethod: 'Credit Card',   notes: ''                    },
  { id: _uid(), amount: 120.00, description: 'Gym Membership',           category: 'health',        date: _ago(2),    paymentMethod: 'Credit Card',   notes: 'Monthly plan'        },
  { id: _uid(), amount: 299.99, description: 'Nike Air Max 270',         category: 'shopping',      date: _ago(3),    paymentMethod: 'Credit Card',   notes: 'Birthday gift'       },
  { id: _uid(), amount:  85.00, description: 'Electricity Bill',         category: 'bills',         date: _ago(4),    paymentMethod: 'Bank Transfer', notes: 'July bill'           },
  { id: _uid(), amount:  52.00, description: 'Restaurant Dinner',        category: 'food',          date: _ago(5),    paymentMethod: 'Cash',          notes: 'Date night'          },
  { id: _uid(), amount:  12.50, description: 'Spotify Premium',          category: 'entertainment', date: _ago(6),    paymentMethod: 'Credit Card',   notes: ''                    },
  { id: _uid(), amount:  35.00, description: 'Pharmacy',                 category: 'health',        date: _ago(7),    paymentMethod: 'Cash',          notes: 'Cold medicine'       },
  { id: _uid(), amount: 450.00, description: 'Weekend Trip to NYC',      category: 'travel',        date: _ago(8),    paymentMethod: 'Credit Card',   notes: 'Hotel + food'        },
  { id: _uid(), amount:  28.00, description: 'Lunch with Team',          category: 'food',          date: _ago(9),    paymentMethod: 'Credit Card',   notes: ''                    },
  { id: _uid(), amount:  95.00, description: 'Internet Bill',            category: 'bills',         date: _ago(10),   paymentMethod: 'Bank Transfer', notes: 'Monthly'             },
  { id: _uid(), amount: 149.99, description: 'React Course on Udemy',    category: 'education',     date: _ago(11),   paymentMethod: 'Credit Card',   notes: 'Full-stack bootcamp' },
  { id: _uid(), amount:  22.00, description: 'Gas Station',              category: 'transport',     date: _ago(12),   paymentMethod: 'Debit Card',    notes: ''                    },
  { id: _uid(), amount:  18.50, description: 'Coffee Shop',              category: 'food',          date: _ago(13),   paymentMethod: 'Cash',          notes: ''                    },
  // Last month
  { id: _uid(), amount:  52.30, description: 'Grocery Run',              category: 'food',          date: _ago(5,1),  paymentMethod: 'Debit Card',    notes: ''                    },
  { id: _uid(), amount: 200.00, description: 'Car Service',              category: 'transport',     date: _ago(10,1), paymentMethod: 'Cash',          notes: 'Oil change + tires'  },
  { id: _uid(), amount:  89.99, description: 'Amazon Shopping',          category: 'shopping',      date: _ago(12,1), paymentMethod: 'Credit Card',   notes: 'Kitchen essentials'  },
  { id: _uid(), amount:  85.00, description: 'Electricity Bill',         category: 'bills',         date: _ago(15,1), paymentMethod: 'Bank Transfer', notes: ''                    },
  { id: _uid(), amount: 320.00, description: 'Flight Tickets',           category: 'travel',        date: _ago(20,1), paymentMethod: 'Credit Card',   notes: 'Domestic round trip' },
  { id: _uid(), amount: 120.00, description: 'Gym Membership',           category: 'health',        date: _ago(25,1), paymentMethod: 'Credit Card',   notes: ''                    },
  { id: _uid(), amount:  32.00, description: 'Streaming Bundle',         category: 'entertainment', date: _ago(28,1), paymentMethod: 'Credit Card',   notes: 'HBO + Disney+'       },
  // 2 months ago
  { id: _uid(), amount:  60.00, description: 'Grocery Store',            category: 'food',          date: _ago(5,2),  paymentMethod: 'Debit Card',    notes: ''                    },
  { id: _uid(), amount: 180.00, description: 'Sony WH-1000XM5',          category: 'shopping',      date: _ago(8,2),  paymentMethod: 'Credit Card',   notes: 'Noise-cancelling'    },
  { id: _uid(), amount:  95.00, description: 'Internet + Phone Bills',   category: 'bills',         date: _ago(12,2), paymentMethod: 'Bank Transfer', notes: ''                    },
  { id: _uid(), amount:  35.00, description: 'Cinema + Popcorn',         category: 'entertainment', date: _ago(15,2), paymentMethod: 'Cash',          notes: ''                    },
  { id: _uid(), amount: 110.00, description: 'Doctor Visit',             category: 'health',        date: _ago(20,2), paymentMethod: 'Credit Card',   notes: 'Annual checkup'      },
  { id: _uid(), amount:  75.00, description: 'Taxi rides',               category: 'transport',     date: _ago(22,2), paymentMethod: 'Cash',          notes: ''                    },
  // 3 months ago
  { id: _uid(), amount:  55.00, description: 'Supermarket',              category: 'food',          date: _ago(3,3),  paymentMethod: 'Debit Card',    notes: ''                    },
  { id: _uid(), amount: 490.00, description: 'International Flight',     category: 'travel',        date: _ago(7,3),  paymentMethod: 'Credit Card',   notes: 'Business trip'       },
  { id: _uid(), amount: 130.00, description: 'Winter Jacket',            category: 'shopping',      date: _ago(14,3), paymentMethod: 'Credit Card',   notes: 'Zara sale'           },
  { id: _uid(), amount:  85.00, description: 'Electricity Bill',         category: 'bills',         date: _ago(18,3), paymentMethod: 'Bank Transfer', notes: ''                    },
  { id: _uid(), amount:  65.00, description: 'Online Course',            category: 'education',     date: _ago(24,3), paymentMethod: 'Credit Card',   notes: 'Python ML'           },
].map(e => ({ ...e, createdAt: new Date().toISOString() }))
