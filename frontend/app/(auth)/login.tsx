import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

const login = () => {
  const [username, setUsername] = useState('')

  return (
    <View>
      <Text>login</Text>
      <TextInput placeholder='Username' value='username' onChangeText={setUsername}/>
      <TextInput />
    </View>
  )
}

export default login

const styles = StyleSheet.create({})