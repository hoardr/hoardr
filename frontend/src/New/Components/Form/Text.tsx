export function Text({name, label}: {name: string, label: string}) {
    return <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <div className="mt-1">
            <input
                type="text"
                name={name}
                id={name}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
        </div>
    </div>
}
