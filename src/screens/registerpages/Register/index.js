import React, { useState, useRef } from 'react'
import { ScrollView, Animated, Dimensions } from 'react-native'
import RegisterLayout from '../../../components/register-layout';
import { auth, firestore } from '../../../config/config';
import moment from 'moment';
import 'moment/locale/tr';
import { showMessage } from 'react-native-flash-message';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
import Page7 from './Page7';
import Page8 from './Page8';

const { width, height } = Dimensions.get("window");

const Register = () => {
    const [Loading, setLoading] = useState(false);
    const [animation] = useState(new Animated.Value(0))
    const [BirthDate, setBirthDate] = useState(moment.now());
    const [FirstPage, setFirstPage] = useState(null);
    const [Target, setTarget] = useState(null);
    const [HealthProblem, setHealthProblem] = useState(null);
    const [CronicProblem, setCronicProblem] = useState(null);
    const [Nutrition, setNutrition] = useState(null);
    const [Aktiflik, setAktiflik] = useState(null);
    const [Days, setDays] = useState(null);
    const scrollRef = useRef(null);

    const moveNext = index => {
        scrollRef.current.scrollTo({
            x: index * width,
            animation: false
        })
    }

    const moveBack = index => {
        scrollRef.current.scrollTo({
            x: index * width,
            animation: false
        })
    }

    const showMsg = ({ message, description, type }) => {
        setLoading(false);
        showMessage({
            message,
            description,
            type: type,
            icon: type,
            hideStatusBar: true
        });
    }

    const registerUser = async (values) => {
        const fields = { ...FirstPage }

        const birthDate = moment(BirthDate).format('DD-MM-YYYY');
        const gender = fields.gender;
        const age = moment().diff(moment(birthDate, 'DD-MM-YYYY'), 'years');
        const weight = parseInt(fields.weight);
        const height = parseInt(fields.height);
        const faValue = Aktiflik;
        const genderValue = gender === "male" ? 5 : -161;
        const bmhValue = parseFloat(10 * parseFloat(weight)) + parseFloat(6.25 * parseFloat(height)) - parseFloat(5 * parseFloat(age)) - genderValue;
        const energy = Target === -1 ? parseInt(bmhValue * faValue) - 500 : Target === 0 ? parseInt(bmhValue * faValue) : parseInt(bmhValue * faValue) + 500;

        setLoading(true);
        try {
            const profileValues = {
                firstName: fields.firstName,
                lastName: fields.lastName,
                cronicProblems: [CronicProblem],
                healthProblems: [HealthProblem],
                days: Days,
                email: values.email,
                birthDate: moment(fields.birthDate).unix(),
                gender: fields.gender,
                point: 0,
                usedFreePremium: false,
                username: values.username,
                values: {
                    activity: Aktiflik,
                    energy,
                    faValue: bmhValue,
                    nutrition: Nutrition,
                    target: Target,
                    weight: parseInt(fields.weight),
                    height: parseInt(fields.height)
                }
            }
            const createUser = await auth().createUserWithEmailAndPassword(values.email, values.password);
            await firestore().collection('users').doc(values.email).set(profileValues, { merge: true });
            await createUser.user.updateProfile({ displayName: `${fields.firstName} ${fields.lastName}` });
            showMsg({ message: 'Başarılı', description: 'Profiliniz oluşturuldu ve kişisel bilgileriniz kaydedildi', type: 'success', icon: 'success' });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('error:', error)
            showMsg({ message: 'Hata', description: `Hata: ${error.message}`, type: 'danger', icon: 'danger' });
        }
    }


    return (
        <RegisterLayout
            title="Kayıt Ol"
            Loading={Loading}
        >
            <ScrollView
                ref={scrollRef}
                pagingEnabled
                horizontal
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {
                                x: animation,
                            }
                        }
                    }
                ])}
            >
                <Page1 submitHandler={e => {
                    setFirstPage({ ...e, birthdate: BirthDate })
                    moveNext(1);
                }} setLoading={setLoading} Loading={Loading} BirthDate={BirthDate} setBirthDate={setBirthDate} />
                <Page3 submitHandler={e => {
                    setTarget(e[0].value);
                    moveNext(2)
                }} setLoading={setLoading} Loading={Loading} handleGoBack={() => moveBack(0)} />
                <Page4 submitHandler={e => {
                    setHealthProblem(e[0].value);
                    moveNext(3)
                }} setLoading={setLoading} Loading={Loading} handleGoBack={() => moveBack(1)} />
                <Page5 submitHandler={e => {
                    setCronicProblem(e[0].value);
                    moveNext(4)
                }} setLoading={setLoading} Loading={Loading} handleGoBack={() => moveBack(2)} />
                <Page6 submitHandler={e => {
                    setNutrition(e[0].value);
                    moveNext(5)
                }} setLoading={setLoading} Loading={Loading} handleGoBack={() => moveBack(3)} />
                <Page7 submitHandler={e => {
                    setAktiflik(e[0].deger);
                    moveNext(6);
                }} setLoading={setLoading} Loading={Loading} handleGoBack={() => moveBack(4)} />
                <Page8 submitHandler={e => {
                    setDays(e[0]);
                    moveNext(7);
                }} setLoading={setLoading} Loading={Loading} handleGoBack={() => moveBack(5)} />
                <Page2 submitHandler={(e) => registerUser(e)} setLoading={setLoading} Loading={Loading} handleGoBack={() => moveBack(6)} />
            </ScrollView>
        </RegisterLayout>
    )
}

export default Register;