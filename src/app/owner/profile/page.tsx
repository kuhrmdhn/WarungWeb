"use client"
import { bcryptConfig } from '@/config/bcrypt';
import { userRouter } from '@/lib/database/userRouter';
import { User } from '@/types/userInterface';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { defaultUserData } from '../../constant/defaultUserData';

export default function ProfilePage() {
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
    const [isChangePassword, setIsChangePassword] = useState(false)
    const [changePassword, setChangePassword] = useState({
        currentPassword: "",
        newPassword: ""
    })
    const [userData, setUserData] = useState<User>(defaultUserData)
    const { data, status } = useSession();
    const { editUser, getUser } = userRouter
    const changePasswordInput = [
        {
            name: "currentPassword",
            value: changePassword.currentPassword,
            label: "Password"
        },
        {
            name: "newPassword",
            value: changePassword.newPassword,
            label: "New Password"
        },
    ]
    useEffect(() => {
        if (data && status === "authenticated") {
            setUserData({ id: data.user.id, username: data.user.name, role: data.user.role } as User)
        }
    }, [data, status])
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSaveButtonDisabled(false)
        const { name, value } = e.target
        if (name === "username") {
            setUserData((state) => ({ ...state, [name]: value }))
        } else {
            setChangePassword((state) => ({ ...state, [name]: value }))
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isChangePassword) {
            const { currentPassword, newPassword } = changePassword
            const { username } = userData
            if (currentPassword && newPassword && username) {
                console.log({ currentPassword, newPassword, username })
                const user = await getUser(username, currentPassword)
                console.log({ user })
                const password = await bcryptConfig.hashPassword(newPassword)
                if (user) {
                    const newUserData = {
                        ...userData,
                        password
                    }
                    await editUser(newUserData);
                }
            }
        } else {
            await editUser(userData);
        }
        await signOut()
    }

    return (
        <section className="w-full min-h-[75svh] flex flex-col justify-around items-center">
            <form className="h-full w-5/6 sm:w-1/2 flex flex-col gap-7" onSubmit={(e) => handleSubmit(e)}>
                <FormControl className="flex gap-7 items-center">
                    <FormLabel htmlFor="username" className="w-32 lg:w-64 text-xs lg:text-base">
                        Username
                    </FormLabel>
                    <Input id="username" value={userData.username} onChange={(e) => handleOnChange(e)} name="username" />
                </FormControl>
                {
                    isChangePassword &&
                    changePasswordInput.map((input, index) => (
                        <FormControl key={index} className="flex gap-7 items-center">
                            <FormLabel className="w-32 lg:w-64 text-xs lg:text-base" htmlFor={input.name}>{input.label}</FormLabel>
                            <Input
                                onChange={(e) => handleOnChange(e)}
                                placeholder={input.label}
                                id={input.name}
                                value={input.value}
                                name={input.name}
                                type='password'
                            />
                        </FormControl>
                    ))
                }
                <Button
                    variant={"link"}
                    colorScheme={isChangePassword ? "red" : "blue"}
                    className="w-fit"
                    onClick={() => setIsChangePassword((state) => !state)}
                >
                    {isChangePassword ? "Cancel" : "Change password?"}
                </Button>
                <Button
                    className='w-fit self-end'
                    colorScheme='blue'
                    type="submit"
                    disabled={saveButtonDisabled}
                >
                    Save
                </Button>
            </form>
        </section>
    );
}

