const DropdownMenu = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="relative mt-1">
        <button
          type="button"
          className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-x-slate-500 sm:text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">{value}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M6 8l4 4 4-4" clipRule="evenodd" />
            </svg>
          </span>
        </button>
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="absolute z-10 mt-1 w-full h-60 overflow-auto rounded-md bg-white shadow-lg">
            <ul
              tabIndex="-1"
              role="listbox"
              aria-labelledby="dropdown"
              aria-activedescendant=""
              className="py-1 text-base ring-1 ring-black ring-opacity-5 rounded-md shadow-xs"
            >
              {options.map((option, idx) => (
                <li
                  key={idx}
                  role="option"
                  onClick={() => {
                    onChange(option); // Call the onChange function with the selected option
                    setIsOpen(false);
                  }}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
                >
                  <div className="flex items-center">{option}</div>
                </li>
              ))}
            </ul>
          </div>
        </Transition>
      </div>
    );
  };
  export default DropdownMenu;