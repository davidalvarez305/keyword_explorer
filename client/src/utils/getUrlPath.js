import React from 'react'

export default function getUrlPath(str) {
  const { pathname } = new URL(str);
  return pathname;
}
