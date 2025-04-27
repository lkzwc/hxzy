"use client";

import { useState, useEffect } from "react";
import TagCloud from "./TagCloud";
import useSWR, { mutate as globalMutate } from "swr";
import { useRouter } from "next/navigation";
import { Tag } from "antd";

interface TagType {
  text: string;
  value: number;
}

interface TagsResponse {
  tags: TagType[];
  topTags: string[];
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("获取标签数据失败");
  }
  return res.json();
};

const tagColors = [
  "processing",
  "warning",
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

// 为标签颜色定义CSS变量
const tagColorStyles = {
  "--tag-magenta-bg": "#fff0f6",
  "--tag-magenta-color": "#eb2f96",
  "--tag-red-bg": "#fff1f0",
  "--tag-red-color": "#f5222d",
  "--tag-volcano-bg": "#fff2e8",
  "--tag-volcano-color": "#fa541c",
  "--tag-orange-bg": "#fff7e6",
  "--tag-orange-color": "#fa8c16",
  "--tag-gold-bg": "#fffbe6",
  "--tag-gold-color": "#faad14",
  "--tag-lime-bg": "#fcffe6",
  "--tag-lime-color": "#a0d911",
  "--tag-green-bg": "#f6ffed",
  "--tag-green-color": "#52c41a",
  "--tag-cyan-bg": "#e6fffb",
  "--tag-cyan-color": "#13c2c2",
  "--tag-blue-bg": "#e6f7ff",
  "--tag-blue-color": "#1677ff",
  "--tag-geekblue-bg": "#f0f5ff",
  "--tag-geekblue-color": "#2f54eb",
  "--tag-purple-bg": "#f9f0ff",
  "--tag-purple-color": "#722ed1",
};

// 将CSS变量添加到文档根元素
if (typeof document !== "undefined") {
  const root = document.documentElement;
  Object.entries(tagColorStyles).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function getRandomColor() {
  return tagColors[Math.floor(Math.random() * tagColors.length)];
}

const TagCloudContainer = () => {
  const { data, error, isLoading } = useSWR<TagsResponse>(
    "/api/tags",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-white rounded-lg shadow-sm border border-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full h-64 bg-white rounded-lg shadow-sm border border-gray-100 flex justify-center items-center text-gray-500">
        无法加载标签云
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h3 className="text-base font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary rounded-full"></span>
        热门标签
      </h3>
      {/* <TagCloud tags={data.tags} maxTags={50} /> */}
      {data.topTags && data.topTags.length > 0 && (
        <div className="mt-3 flex flex-wrap">
          {data.topTags.slice(0, 12).map((tag, index) => {
            return (
              <Tag
                key={tag}
                bordered={false}
                color={tagColors[index % tagColors.length]}
                className="mr-2 mb-2"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("tag", tag);
                  window.history.pushState(
                    {},
                    "",
                    `/community?${params.toString()}`
                  );
                  globalMutate(
                    (key) =>
                      typeof key === "string" && key.startsWith("/api/posts")
                  );
                }}
              >
                {tag}
              </Tag>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagCloudContainer;
