'use client'
import { Avatar, Button, Card, Divider ,List} from "antd";
import { useSession, signOut } from "next-auth/react";
import { UserOutlined, SafetyOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function Settings() {
    const { data: session, status } = useSession();
    console.log("session,",useSession())
    return <div>
        <Card 
            title={
                <div className="flex items-center gap-4">
                    <Avatar 
                        className="bg-primary/10 text-primary"
                        size={64}
                        src={session?.user?.image}
                    >
                        {(session?.user?.name || '用户')[0].toUpperCase()}
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold">
                            {session?.user?.name || '用户'}
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {session?.user?.email}
                        </p>
                    </div>
                </div>
            }
            variant={"borderless"}
        >
            <Divider orientation="left" orientationMargin={0}>账户设置</Divider>
            <List itemLayout="horizontal">
                <List.Item>
                    <List.Item.Meta
                        avatar={<UserOutlined className="text-lg" />}
                        title="个人信息"
                        description="管理您的个人资料信息"
                    />
                    <Button type="link">编辑</Button>
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        avatar={<SafetyOutlined className="text-lg" />}
                        title="账号安全"
                        description="修改密码或绑定手机"
                    />
                    <Button type="link">设置</Button>
                </List.Item>
            </List>
            
            <Divider orientation="left" orientationMargin={0}>操作</Divider>
            <Button 
                danger 
                icon={<LogoutOutlined />}
                onClick={() => signOut({ callbackUrl: '/' })}
                block
            >
                退出登录
            </Button>
            
            <div className="mt-6 text-gray-400 text-sm">
                注册时间：{new Date(session?.user?.createdAt ?? Date.now()).toLocaleDateString()}
            </div>
        </Card>
    </div>;
}