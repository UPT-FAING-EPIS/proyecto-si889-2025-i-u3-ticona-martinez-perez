const StatsCard = ({ title, value, icon, change, changeType, description }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center">
              <span className="text-indigo-600 text-lg">{icon}</span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span className="sr-only">{changeType === "positive" ? "Aumentó" : "Disminuyó"} en</span>
                    {change}
                  </div>
                )}
              </dd>
              {description && <dd className="text-sm text-gray-500 mt-1">{description}</dd>}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
