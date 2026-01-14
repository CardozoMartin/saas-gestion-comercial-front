import React from 'react'

const TableCategory = ({ AllCategories }: any) => {
  return (
     <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300/70">
                  <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                    ID
                  </th>
                  <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                    Categoria
                  </th>
                  <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                    Descripcion
                  </th>
                  <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              {AllCategories.map((category, index) => (
                <tbody>
                  <td className="px-3 py-3 text-gray-800/80 font-medium">
                    {index}
                  </td>

                  <td className="px-3 py-3 text-gray-800/80 font-medium">
                    {category.nombre}
                  </td>
                  <td className="px-3 py-3 text-gray-800/80 font-medium">
                    {category.descripcion}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded hover:bg-gray-500/20 transition">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.672 6.763 5.58 15.854l-.166 2.995 2.995-.166L17.5 9.59m-2.828-2.828 1.348-1.349a2 2 0 1 1 2.829 2.829L17.5 9.59m-2.828-2.828L17.5 9.591"
                            stroke="#1F2937"
                            strokeWidth=".96"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded hover:bg-red-600/20 transition">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 3.833h17m-4.25 0-.287-.766c-.28-.744-.419-1.115-.677-1.39a2.1 2.1 0 0 0-.852-.546C11.559 1 11.118 1 10.237 1H8.763c-.881 0-1.322 0-1.697.131a2.1 2.1 0 0 0-.852.546c-.258.275-.398.646-.676 1.39l-.288.766m10.625 0v9.634c0 1.586 0 2.38-.347 2.986a3.04 3.04 0 0 1-1.393 1.238c-.682.309-1.575.309-3.36.309h-2.55c-1.785 0-2.678 0-3.36-.309a3.04 3.04 0 0 1-1.393-1.238c-.347-.606-.347-1.4-.347-2.986V3.833m8.5 3.778v6.611m-4.25-6.61v6.61"
                            stroke="#DC2626"
                            strokeOpacity=".8"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tbody>
              ))}
            </table>
  )
}

export default TableCategory