import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import {
	Users,
	Package,
	ShoppingCart,
	DollarSign,
} from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});

	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");

				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);

				console.log(
					"Daily Sales Data:",
					response.data.dailySalesData
				);
			} catch (error) {
				console.error(
					"Error fetching analytics data:",
					error
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return (
			<div className='text-center text-white py-10'>
				Loading analytics...
			</div>
		);
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			{/* Analytics Cards */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color='from-emerald-500 to-teal-700'
				/>

				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color='from-emerald-500 to-green-700'
				/>

				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color='from-emerald-500 to-cyan-700'
				/>

				<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.totalRevenue.toLocaleString(
						undefined,
						{
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}
					)}`}
					icon={DollarSign}
					color='from-emerald-500 to-lime-700'
				/>
			</div>

			{/* Sales Chart */}
			<motion.div
				className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.5,
					delay: 0.25,
				}}
			>
				<h2 className='text-xl font-semibold text-white mb-6'>
					Sales Overview (Last 7 Days)
				</h2>

				{dailySalesData.length === 0 ? (
					<div className='text-center text-gray-400 py-20'>
						No sales data available for the last 7 days.
					</div>
				) : (
					<ResponsiveContainer
						width='100%'
						height={400}
					>
						<LineChart
							data={dailySalesData}
						>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#374151'
							/>

							<XAxis
								dataKey='date'
								stroke='#D1D5DB'
							/>

							<YAxis
								yAxisId='left'
								stroke='#D1D5DB'
							/>

							<YAxis
								yAxisId='right'
								orientation='right'
								stroke='#D1D5DB'
							/>

							<Tooltip />

							<Legend />

							<Line
								yAxisId='left'
								type='monotone'
								dataKey='sales'
								stroke='#10B981'
								strokeWidth={3}
								activeDot={{ r: 8 }}
								name='Sales'
							/>

							<Line
								yAxisId='right'
								type='monotone'
								dataKey='revenue'
								stroke='#3B82F6'
								strokeWidth={3}
								activeDot={{ r: 8 }}
								name='Revenue ($)'
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</motion.div>
		</div>
	);
};

export default AnalyticsTab;

const AnalyticsCard = ({
	title,
	value,
	icon: Icon,
	color,
}) => (
	<motion.div
		className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div
			className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30`}
		/>

		<div className='flex justify-between items-center relative z-10'>
			<div>
				<p className='text-emerald-300 text-sm mb-1 font-semibold'>
					{title}
				</p>

				<h3 className='text-white text-3xl font-bold'>
					{value}
				</h3>
			</div>

			<div className='text-emerald-400'>
				<Icon className='h-12 w-12' />
			</div>
		</div>
	</motion.div>
);