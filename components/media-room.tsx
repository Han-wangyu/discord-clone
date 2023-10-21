"use client"

import React from 'react';
import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles"
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

const MediaRoom = ( { chatId, video, audio }: MediaRoomProps ) => {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (typeof user?.firstName === "undefined" || typeof !user?.lastName === "undefined") {
            return ;
        }

        function random4DigitNumber() {
            // Generate a random number between 1000 and 9999 (inclusive)
            return Math.floor(Math.random() * 9000) + 1000;
        }

        const name = `${user.firstName ?? "User"} ${user.lastName ?? user.emailAddresses[0].emailAddress.split("@").shift()} - ${random4DigitNumber()}`;  // // the random4DigitNumber to prevent disconnected livekit if 2 person have same name

        (async () => {
            try {
                const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
                const data = await resp.json();
                setToken(data.token);
            } catch (error) {
                console.log(error)
            }
        })()
    }, [chatId, user?.firstName, user?.lastName]);

    if (token === "") {
        return (
            <div className={"flex flex-col flex-1 justify-center items-center"}>
                <Loader2 className={"h-7 w-7 text-zinc-500 animate-spin my-4"} />
                <p className={"text-xs text-zinc-500 dark:text-zinc-400"}>
                    Loading...
                </p>
            </div>
        )
    }

    return (
        <div>
            <LiveKitRoom data-lk-theme="default" serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} token={token} connect={true} video={video} audio={audio}>
                <VideoConference />
            </LiveKitRoom>
        </div>
    );
};

export default MediaRoom;
