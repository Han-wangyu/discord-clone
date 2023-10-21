import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db"

export const initialProfile = async () => {
    const user = await currentUser();
    if (!user) {
        return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    if (profile) {
        return profile;
    }

    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName ?? "User"} ${user.lastName ?? user.emailAddresses[0].emailAddress.split("@").shift()}`,  // add email username and `User` tag when lastName or firstName is `null`
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        }
    });

    return newProfile;
}
