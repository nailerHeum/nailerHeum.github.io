---
title: "Leetcode merge two sorted lists(Python)"
date: "2020-01-09"
---

[문제 링크](https://leetcode.com/problems/merge-two-sorted-lists/)



#### 접근 (의식의 흐름)

간단한 Linked list 두개를 merge시키는 문제에요. 저는 두 list 중 하나를 기준으로 삼아 다른 list의 node들을 삽입시키는 방법을 생각했어요. Loop 내에서 연산을 보다 간단히 하기 위해서 더 작은 값을 갖고 있는 list를 기준으로 삼아서 풀기로 했어요.



#### 코드

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None
class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        if not l1:
            return l2
        if not l2:
            return l1
        head = comp = None
        if l1.val <= l2.val:
            head, comp = l1, l2
        else:
            head, comp = l2, l1
        gateway = head
        while head and comp:
            if not head.next:
                head.next = comp
                return init
            if head.next.val < comp.val:
                head = head.next
                continue
            if head.next.val >= comp.val:
                tmp = comp
                comp = comp.next
                tmp.next = head.next
                head.next = tmp
                head = tmp
        return gateway 
```



![image-20200109144257721](leetcode-merge-two-sorted-lists/image-20200109144257721.png)

