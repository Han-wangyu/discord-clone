 "use client"
 import React from 'react';
 import { ActionToolTip } from "@/components/action-tooltip";
 import {usePathname, useRouter, useSearchParams} from "next/navigation";
 import {Video, VideoOff} from "lucide-react";
 import qs from "query-string"

 const ChatVideoButton = () => {
     const router = useRouter();
     const pathname = usePathname();
     const searchParams = useSearchParams();

     const isVideo = searchParams?.get("video");

     const onClick = () => {
         const url = qs.stringifyUrl({
             url: pathname || "",
             query: {
                 video: isVideo ? undefined : true,
             }
         }, { skipNull: true });

         router.push(url);
     }

     const Icon = isVideo ? VideoOff : Video;
     const tooltipLabel = isVideo ? "End video call" : "Start video call";

     return (
         <div>
             <ActionToolTip side={"bottom"} label={tooltipLabel}>
                 <button onClick={onClick} className={"hover:opacity-75 transition mr-4"}>
                     <Icon className={"h-6 w-6 mt-1.5 text-zinc-500 dark:text-zinc-400"} />
                 </button>
             </ActionToolTip>
         </div>
     );
 };

 export default ChatVideoButton;

