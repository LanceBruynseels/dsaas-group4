import React from 'react';
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";

const ReactionButton = ({ gradient, iconPath, label }) => {
    const supabase = createClientComponentClient(); // Initialize Supabase client
    const {data: reactionButton} = await supabase
        .from("notifications") // Replace with your actual table name
        .insert({ user_id: user_id,
            target_user_id: target_user_id,
            status: status,
            date: new Date().getDate()
        })

    return (
    <div className="flex flex-col justify-center align-middle">
      <button
        className={`bg-gradient-to-br ${gradient} max-w-[48px] p-3 justify-center align-middle rounded-full hover:bg-gray-300 transition`}>
        <svg
          className="w-6 h-6 text-white dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
        </svg>
      </button>
      <p className="text-white justify-center align-middle pt-2">{label}</p>
    </div>
  );
};