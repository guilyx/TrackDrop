import { FC, useState } from 'react';
import { Transaction } from '../services/explorers/explorer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getAirdropTasks } from '../utils/criterias.ts';

interface AirdropCardProps {
  address: string;
  chain_name: string;
  logo: string;
  // Maybe add bridge contract ? idk
  transactions: Transaction[] | [];
}


const AirdropCard: FC<AirdropCardProps> = ({ address, transactions, chain_name, logo }) => {
  const tasks = getAirdropTasks(address, chain_name, transactions);
  
  const completedSubtasksCount = tasks.reduce((total, task) => {
    return total + task.subtasks.filter((subtask) => subtask.completed).length;
  }, 0);
  const [expandedTasks, setExpandedTasks] = useState<boolean[]>(Array(tasks.length).fill(false));

  const isTaskCompleted = (task) => task.subtasks.some((subtask) => subtask.completed);
  const completedTasksCount = tasks.filter((task) => isTaskCompleted(task)).length;

  const toggleTaskExpansion = (index: number) => {
    const updatedExpandedTasks = [...expandedTasks];
    updatedExpandedTasks[index] = !updatedExpandedTasks[index];
    setExpandedTasks(updatedExpandedTasks);
  };

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 mb-4 ml-4 mr-4 w-[807px] sm:p-6 dark:bg-gray-800 h-auto flex">
      {/* Left Section */}
      <div className="lg:sticky top-0 flex">
        <div className="flex-1 flex flex-col dark:border-gray-700 pr-4">
          <div className="flex flex-col justify-start items-center h-full">
            <img src={logo} alt="Your Description" className="mb-4 w-1/2 max-w-[200px]" />
            <div className="flex flex-col items-center">
              <p className={`text-xl font-bold mb-2 ${completedSubtasksCount > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                {completedSubtasksCount > 0 ? 'Congratulations!' : 'Boo!'}
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                You have met{' '}
                <span className={completedSubtasksCount === 0 ? 'text-red-500' : 'text-blue-500'}>
                  {completedSubtasksCount}
                </span>{' '}
                criteria!
              </p>
            </div>
          </div>
        </div>
        <div className="border-r border-gray-200 dark:border-gray-700 transition-all" />
      </div>

      {/* Right Section */}
      <div className="flex-1 pl-4">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {tasks.map((task, index) => (
            <li className="py-3 sm:py-4" key={index}>
              <div className="flex items-center justify-between">
                <div className="text-lg mr-2">
                  {isTaskCompleted(task) ? (
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{task.name}</p>
                </div>
                <button onClick={() => toggleTaskExpansion(index)}>
                  <FontAwesomeIcon icon={expandedTasks[index] ? faMinus : faPlus} />
                </button>
              </div>
              {expandedTasks[index] && (
                <ul className="mt-2 pl-6">
                  {task.subtasks.map((subtask, subIndex) => (
                    <li className="py-2" key={subIndex}>
                      <div className="flex items-center">
                        <div className="text-lg mr-2">
                          {subtask.completed ? (
                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                          ) : (
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{subtask.name}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AirdropCard;
