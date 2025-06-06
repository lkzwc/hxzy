"use client";

import { useState, useEffect, useContext } from "react";
import { TagsOutlined, FireOutlined } from "@ant-design/icons";
import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Spin } from "antd";
import { DataContext, DataContextType } from "../layout";
import { getTagColor, getTagSize } from "@/app/utils/compassData";




export default function TopicsPage() {
  const { tags } = useContext(DataContext)

  const [loading, setLoading] = useState(false);

  return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <TagsOutlined className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">话题广场</h1>
            <p className="text-gray-500 text-sm">探索中医社区的热门话题</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" /> 
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                所有话题
              </h2>
              <motion.div
                className="p-6 bg-gray-50 rounded-xl flex flex-wrap gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {tags?.map((tag) => (
                  <motion.div
                    key={tag.text}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link
                      href={`/community?tag=${encodeURIComponent(tag.text)}`}
                      className={`inline-block px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 ${getTagColor(tag.value)} ${getTagSize(tag.value)} transition-all duration-200`}
                    >
                     
                     #{tag.text}{" "}<span className="text-xs opacity-70">({tag.value})</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </>
        )}
      </div>
  );
}
