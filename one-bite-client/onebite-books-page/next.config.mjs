/** @type {import('next').NextConfig} */
const nextConfig = {
  // react 에 존재하는 잠재적인 문제를 해결하고자 할 때, 렌더링을 2번 하게 된다.
  // 이를 방지하고자 false로 적용한다.
  reactStrictMode: false,
};

export default nextConfig;
